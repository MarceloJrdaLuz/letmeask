import { get, off, ref } from "firebase/database";
import { useEffect, useState } from "react"
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Questions = {
    id: string
    author: {
        name: string;
        avatar: string;
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likeCount: number
    hasLiked: boolean
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string | undefined){
    const { user } = useAuth()
    const [questions, setQuestions] = useState<Questions[]>([])
    const [title, setTitle] = useState('')

    useEffect(()=>{
        const roomRef = ref(database, `rooms/${roomId}`)
        get(roomRef).then(room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
        return () => {
            off(roomRef)
        }
    },[questions , roomId, user?.id])

    return{
        questions, title
    }
}