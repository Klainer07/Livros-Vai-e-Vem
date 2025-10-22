<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    // Campos que podem ser preenchidos via mass assign
    protected $fillable = [
        'title',
        'author',
        'genre',
        'condition',
        'cover_image', // caminho da imagem
        'status',      // disponível, emprestado, trocado
        'location',
        'user_id',     // dono do livro
    ];

    // Relação: livro pertence a um usuário (dono)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relação: transações relacionadas a este livro
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Relação: avaliações do livro
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Checa se o livro está disponível
    public function isAvailable(): bool
    {
        return $this->status === 'disponível';
    }

    // Média de ratings do livro
    public function averageRating(): float
    {
        return $this->ratings()->avg('score') ?? 0;
    }
}
