import { useState, useEffect, useCallback } from "react";

interface ConfirmState{
    isOpen: boolean;
    message: string;
    resolve: ((value: boolean) => void) | null;
}

export const useConfirm = () =>{
    const [state, setState] = useState <ConfirmState>({
        isOpen: false, 
        message: '',
        resolve: null,
    });

    const confirm = useCallback((message: string):Promise<boolean> =>{
        return new Promise((resolve) =>{
            setState({isOpen: true, message, resolve})
        })
    }, []);

    const handleConfirm = useCallback(() =>{
        state.resolve?.(true);
        setState(prev => ({...prev, isOpen: false, resolve: null}));
    }, [state.resolve]) ;

    const handleCancel = useCallback(() =>{
        state.resolve?.(false);
        setState(prev =>({...prev, isOpen: false, resolve: null}))
    }, [state.resolve]);

    return {
        confirm, 
        isOpen: state.isOpen,
        message: state.message,
        handleConfirm,
        handleCancel
    }

}