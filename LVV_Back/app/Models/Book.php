<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'title',
        'author',
        'genre',
        'condition',
        'cover_image', 
        'status',      
        'location',
        'user_id',     
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    
    public function isAvailable() 
    {
        return in_array($this->status, ['para emprestar', 'para doar']);
    }

    
    public function averageRating(): float
    {
        return $this->ratings()->avg('score') ?? 0;
    }
}
