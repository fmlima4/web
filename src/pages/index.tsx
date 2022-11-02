interface HomeProps{
  poolCount: number
  guessCount: number
  userCount: number
}

import Image from "next/image"
import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImage from '../assets/logo.svg'
import avatarExampleImage from '../assets/users-avatar-example.png'
import iconCheckImage from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from 'react'

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('bolão criado com sucesso, o codigo foi copiado para area de transferencia')

      setPoolTitle('')
    } catch (error) {
      alert("falha tente novamente")
    }
    
  }
  
  return (
    <div className="max-w-[1124px] mt-4 mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImage} alt="logomarca" quality={100}/>

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu bolão da copa e compartilhe com os amigos</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatarExampleImage} alt="logomarca" quality={100}/>
          <strong className="text-ignite-100">
            <span className="text-ignite-500">+{props.userCount}</span> Pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100 " 
            type="text" 
            required 
            placeholder="Nome do bolão" 
            onChange={event => setPoolTitle(event.target.value) }
            value={poolTitle}
          />
          <button 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase" 
            type="submit"
          >Criar bolão!</button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxad">Após criar o bolão voce recebera um codigo unico que pode ser usado para convidar mais pessoas para o bolão</p>
        
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="iconCheckImage" quality={100}/>
            <div className="flex flex-col">
              <span>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="iconCheckImage" quality={100}/>
            <div className="flex flex-col">
              <span>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImage} alt="preview two phones with mobile layout" quality={100}/>
    </div>
  )
}

export const getServerSideProps = async () => {

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('user/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
