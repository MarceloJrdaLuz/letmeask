import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from '../services/firebase';

export function Home() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {

        if(!user) {
            await signInWithGoogle()
        }
        navigate('/rooms/new')
    }

    async function handleJoinRoom(e: FormEvent){
        e.preventDefault()
        if (roomCode.trim() === ''){
            return
        }


        const roomRef = ref(database)
        await get(child(roomRef, `rooms/${roomCode}`)).then(snapshot => {
            console.log(snapshot)
            if(!snapshot.exists()){
                alert('Essa sala não existe')
                return
            }
            navigate(`rooms/${roomCode}`)
        })
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
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua conta com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={e => setRoomCode(e.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}