import { PineconeStore } from "@langchain/pinecone";

export const getFromIndex = async () => {
    const index = await getIndex();
    const store = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    return store;
};