import { createContext, useState } from "react";
import run from "../config/gemini";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState(""); //to save input data
    const [recentPrompt, setRecentPrompt] = useState(""); //to save data when sent button is clicked and display in main component
    const [prevPrompts, setPrevPrompts] = useState([]); //to store the input history
    const [showResult, setShowResult] = useState(false); //hide greet text (cards)
    const [loading, setLoading] = useState(false); //to show loading animation
    const [resultData, setResultData] = useState(""); //to display result on web page

    const delayPara=(index,nextWord)=>{//text displaying by typing on main section
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }
    const newChat=()=>{//for creating new chat on clicking new chat button
        setLoading(false);
        setShowResult(false);

    }

    const onSent = async (prompt) => {

        setResultData(""); //so that prev response is removed from the state variable
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !==undefined){
            response=await runChat(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])//to store the data in sidebar component
            setRecentPrompt(input)
            response=await runChat(input)
        }
        let responseArray=response.split("*");
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){//this loop logic is to make the text bold
            if(i===0 || i%2!==1){
                newResponse +=responseArray[i];
            }
            else{
                newResponse+="<b>"+responseArray[i]+"</b";
            }
        }
        let newResponse2=newResponse.split("*").join("</br>");
        let newResponseArray=newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
        setInput("");
    }



    const contextValue = { //providing the state and setter functions to access in main and sidebar component 
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;