<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// AINDA SEM USO

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',  
        'rater_id',        
        'rated_user_id',  
        'book_id',        
        'score',           
        'comment',         
    ];

    
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    
    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    
    public function ratedUser()
    {
        return $this->belongsTo(User::class, 'rated_user_id');
    }

    
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    
    public function isPositive(): bool
    {
        return $this->score >= 4;
    }

    public function isNeutral(): bool
    {
        return $this->score === 3;
    }

    public function isNegative(): bool
    {
        return $this->score <= 2;
    }
}
