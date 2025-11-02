<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keyword extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'keyword',
        'match_type',
    ];

    /**
     * Get the topic that owns this keyword.
     */
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
