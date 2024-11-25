import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getFromIndex } from "../query/getFromIndex";
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { BASE_TEMPLATE } from "../services/templates";
import { RunnableSequence } from "@langchain/core/runnables";
import { streamingChatModel } from "../services/gptModels";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const chatProcess = async (message: string, options?: { k?: number }): Promise<any> => {
    try {
        // get indexes
        const getStore = await getFromIndex();
        if (getStore) {
            // perform a similarity search to find the most relevant documents
            const retrieve = getStore.asRetriever({
                k: options?.k || 10
            });

            // 
            const retrievedDocs = await retrieve.invoke(message);

            if (!retrievedDocs || retrievedDocs.length === 0) {
                throw new Error("No documents found");
            }

            // prompt 
            const prompt = ChatPromptTemplate.fromTemplate(BASE_TEMPLATE);

            // construct the chain
            const chain = RunnableSequence.from([
                prompt,
                streamingChatModel,
                new StringOutputParser()
            ]);

            const response = await chain.invoke({
                context: retrievedDocs,
                question: message
            });

            return response;
        }
    } catch (error) {
        console.error("Chat process error:", error);
        return "An error occurred while processing your request.";
    }
};