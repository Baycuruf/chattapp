import React, { useState } from 'react'
import { resetPassword } from '../../../firebase';

function UpdatePassword() {
    const [password,setPassword] = useState("");
    const handleResetSubmit = async e =>{
        e.preventDefault();
        const result = await resetPassword(password);
        if(result) {
          setPassword("")  
        }
        
    }
  return (
    <form
        className="grid gap-y-4 py-4 max-w-xl mx-auto text-black"
        onSubmit={handleResetSubmit}
      >
        <h1 className='text-xl font-bold mb-4 text-white'>Parolayı Güncelle</h1>
        <div>
          <label className="block text-sm font-medium text-white">Parola</label>
          <input
            type="password"
            placeholder="Parolayı değiştir"
            className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        
        <div>
          <button
            className="bg-primary cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            type="submit"   
            disabled={!password}     
          >
           Şifreyi Güncelle 
          </button>
        </div>
      </form>
  )
}

export default UpdatePassword
