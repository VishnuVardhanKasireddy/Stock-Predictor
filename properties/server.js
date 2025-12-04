import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import "dotenv/config"
import cors from "cors"
const port =3000
const app=express()
app.use(express.json())
app.use(cors())

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"})

app.post('/chat',async (req,res)=>{
    try{
        const messages=req.body.messages
        const prompt=messages.map(m=>`${m.role}:${m.content}`).join("\n")
        const result= await model.generateContent(prompt)
        const reply=await result.response.text()
        res.json({reply})
    }catch(err){
        console.log("error accessing api",err)
        res.json({msg:`error accessing the ai`})
    }
})
app.get('/',(req,res)=>{
    res.json({msg:`not here!`})
})
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`)
})
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "AIzaSyBCtMGbAgGkAJWccsfYihshjySK0b40f_s" });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();