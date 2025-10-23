<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',       
        'sender_id',    
        'receiver_id',   
        'type',          
        'status',       
        'start_date',    
        'end_date',      
    ];

    
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
