<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scraped_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained()->onDelete('cascade');
            $table->text('url');
            $table->text('canonical_url')->nullable();
            $table->string('title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('publish_date')->nullable();
            $table->text('content_text');
            $table->text('content_html')->nullable();
            $table->string('content_hash', 64)->index();
            $table->string('language', 10)->nullable();
            $table->timestamp('scraped_at');
            $table->jsonb('matched_keywords')->nullable();
            $table->jsonb('images')->nullable();
            $table->timestamps();
            
            // Full-text search column
            DB::statement('ALTER TABLE scraped_pages ADD COLUMN content_tsv tsvector');
            DB::statement('CREATE INDEX scraped_pages_content_tsv_idx ON scraped_pages USING GIN (content_tsv)');
            
            // Indexes
            $table->index('scraped_at');
            $table->index('publish_date');
            $table->unique(['canonical_url', 'content_hash'], 'unique_page');
        });
        
        // Trigger to auto-update tsvector
        DB::statement("
            CREATE FUNCTION scraped_pages_tsvector_update() RETURNS trigger AS $$
            BEGIN
                NEW.content_tsv := 
                    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(NEW.meta_description, '')), 'B') ||
                    setweight(to_tsvector('english', coalesce(NEW.content_text, '')), 'C');
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
            
            CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON scraped_pages
            FOR EACH ROW EXECUTE FUNCTION scraped_pages_tsvector_update();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS tsvectorupdate ON scraped_pages');
        DB::statement('DROP FUNCTION IF EXISTS scraped_pages_tsvector_update()');
        Schema::dropIfExists('scraped_pages');
    }
};
