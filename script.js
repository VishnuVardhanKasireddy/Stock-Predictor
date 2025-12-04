
import { dates } from "./properties/dateFormat.js"
const container=document.querySelector('.section')
const output=document.querySelector('.output')
const input=document.querySelector('.input')
const btn=document.querySelector('.btn')
const reportBtn=document.querySelector('.report')
const tickersPara=document.querySelector('.para')
let tickers=[]
btn.addEventListener('click',()=>{
    let ticker=input.value.trim().toUpperCase()
    if(tickers.includes(ticker))
        return
    if(ticker===""){
        tickersPara.textContent=`Aleast one ticker is needed!`
        tickersPara.style.color='red'
        return
    }
    if(tickers.length>=3){
        tickersPara.textContent=`Only three tickers allowed at a time!!!`
        tickersPara.style.color='red'
        return
    }   
    tickers.push(ticker)
    tickersPara.textContent=tickers.join(",")
    tickersPara.style.color=`black`
    input.value=""
    reportBtn.disabled=false
})
reportBtn.addEventListener('click',()=>{
    container.innerHTML=`
        <div class="loader-fullscreen">
            <p>Generating Report.....</p>
            <div class="spinner"></div>
        </div>`
    fetchStockData()
})
async function fetchStockData(){
    try{
        const stockData=await Promise.all(tickers.map(async (ticker)=>{
            const url=`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=QTBy_CsieE7DCh9F41DW3rWllxUfdaa6`
            const res=await fetch(url)
            const data=await res.text()
            console.log(data)
            if(res.status===200){
                container.style.display='none'
                output.style.display="flex"
                output.innerHTML=`Creating Report .......`
                return data
            }else
                container.innerHTML=`There was an error fetching stock data`
        }))
        fetchReport(stockData.join(''))
            // renderReport(stockData)
    }catch(err){
        container.innerHTML=`There was an error fetching stock data.`
        console.log('error:',err)
    }
}
async function fetchReport(data){
    const messages=[
        {
            role:"system",
            content:"You are a trading expert.Given data on share prices write a report of no more than 150 words whether to but ,hold or to sell"
        },
        {
            role:"user",
            content:data
        }
    ]
    try{
        const res=await fetch(`http://localhost:3000/chat`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                // "Authorization":"Bearer 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"
            },
            body:JSON.stringify({
                messages:messages
            })
        })
        const result=await res.json()
        console.log(result)
        renderReport(result.reply)
    }catch(err){
        console.log("unable to fetch data from ai ",err)
        container.innerHTML= `unable to access ai , please try to refreash the page`
    }
}
function renderReport(content){
    const report = document.createElement('p')
    report.textContent=content
    report.style.width="100%"
    output.innerHTML=""
    const h=document.createElement('h1')
    h.textContent="Verdict:"
    output.appendChild(h)
    output.appendChild(report)
    
}
