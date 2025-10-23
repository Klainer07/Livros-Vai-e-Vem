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
        'cover_image', // não implementado no momento
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

    
    public function isAvailable(): bool
    {
        return $this->status === 'disponível';
    }

    
    public function averageRating(): float
    {
        return $this->ratings()->avg('score') ?? 0;
    }
}
