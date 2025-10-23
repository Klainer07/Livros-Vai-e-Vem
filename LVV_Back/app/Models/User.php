<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; 

   
    protected $fillable = [
        'name',
        'email',
        'password',
        'username', 
        'avatar',   
        'bio',      
    ];

    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

   
    public function books()
    {
        return $this->hasMany(Book::class);
    }

    public function sentTransactions()
    {
        return $this->hasMany(Transaction::class, 'sender_id');
    }

    public function receivedTransactions()
    {
        return $this->hasMany(Transaction::class, 'receiver_id');
    }

    public function sentRatings()
    {
        return $this->hasMany(Rating::class, 'rater_id');
    }

    public function receivedRatings()
    {
        return $this->hasMany(Rating::class, 'rated_user_id');
    }

    
    public function hasAvailableBooks()
    {
        return $this->books()->where('status', 'disponível')->exists();
    }

    public function averageRating()
    {
        return $this->receivedRatings()->avg('score');
    }
}
