import { QueryClientProvider } from "@tanstack/react-query";
import {queryClient} from './lib/queryClient.js'

function App(){
    return (
        <QueryClientProvider client ={queryClient}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Brain Trainer</h1>
                <p>Welcome to the Brain Trainer Monorepo.</p>
                <p className="mt-2 text-gray-600"> Frontend is connected!</p>
            </div>
        </QueryClientProvider>
    );
}

export default App;