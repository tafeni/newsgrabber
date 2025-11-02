<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Website;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminWebsiteTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_view_websites_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/websites');
        
        $response->assertStatus(200);
    }

    public function test_admin_can_create_website(): void
    {
        $websiteData = [
            'url' => 'https://example.com',
            'label' => 'Example Site',
            'rate_limit_per_minute' => 10,
            'active' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/websites', $websiteData);

        $response->assertRedirect('/admin/websites');
        $this->assertDatabaseHas('websites', ['url' => 'https://example.com']);
    }

    public function test_admin_can_update_website(): void
    {
        $website = Website::factory()->create();

        $updateData = [
            'url' => $website->url,
            'label' => 'Updated Label',
            'rate_limit_per_minute' => 15,
            'active' => false,
        ];

        $response = $this->actingAs($this->admin)
            ->put("/admin/websites/{$website->id}", $updateData);

        $response->assertRedirect('/admin/websites');
        $this->assertDatabaseHas('websites', ['label' => 'Updated Label']);
    }

    public function test_admin_can_delete_website(): void
    {
        $website = Website::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete("/admin/websites/{$website->id}");

        $response->assertRedirect('/admin/websites');
        $this->assertDatabaseMissing('websites', ['id' => $website->id]);
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin/websites');
        
        $response->assertStatus(403);
    }
}
