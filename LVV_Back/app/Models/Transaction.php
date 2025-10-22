<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',       // livro envolvido
        'sender_id',     // usuário que disponibiliza o livro
        'receiver_id',   // usuário que pega o livro
        'type',          // 'borrow' ou 'exchange'
        'status',        // 'pending', 'approved', 'rejected', 'completed'
        'start_date',    // data de início do empréstimo/troca
        'end_date',      // data de término, se aplicável
    ];

    // Relação: cada transação pertence a um livro
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    // Relação: remetente (quem oferece o livro)
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Relação: receptor (quem recebe o livro)
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    // Relação: avaliações dessa transação
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Checa se a transação está pendente
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    // Checa se a transação foi aprovada
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    // Checa se a transação foi concluída
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
