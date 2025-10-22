<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',  // vincula a avaliação à transação
        'rater_id',        // quem está dando a nota
        'rated_user_id',   // quem está recebendo a nota
        'book_id',         // livro relacionado
        'score',           // nota: 1 a 5
        'comment',         // comentário opcional
    ];

    // Relação: a avaliação pertence a uma transação
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Relação: usuário que deu a nota
    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    // Relação: usuário que recebeu a nota
    public function ratedUser()
    {
        return $this->belongsTo(User::class, 'rated_user_id');
    }

    // Relação: livro avaliado
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    // Métodos auxiliares
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
