import { FormEvent, useState } from 'react';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss'
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [newRoom, setNewRoom] = useState('')

    console.log(database)
    

    async function handleCreateRoom(e: FormEvent){ // a principio  ele nao consegue capturar os eventos gerados por ser uma função separada, entao e importado o FromEvent do react
        e.preventDefault()

        if(newRoom.trim() === ''){
            return
        }

        const roomRef = ref(database, 'rooms');

        const firebaseRoom = await push(roomRef, {
            title: newRoom,
            authorId: user?.id
        })

        navigate(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da Sala"
                            onChange={e => setNewRoom(e.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente?
                            <Link to="/">clique aqui</Link>
                        `
                    </p>
                </div>
            </main>
        </div>
    )
}