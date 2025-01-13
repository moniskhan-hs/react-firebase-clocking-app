import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useHandleBeforeUnload() {
  const dispatch = useDispatch();

  const {activeRowId,counter,isRunning}= useSelector((state:{counter:CounterInitState})=>state.counter)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isRunning) {
        // Trigger browser confirmation dialog
        event.preventDefault();
        event.returnValue = ""; // Required for confirmation dialog

        // Stop and reset counter
        // console.log('counter value get reseted')
        // dispatch(updateCounter(counter))
        // dispatch(stopCounter());
        // dispatch(resetCounter());

        // Send data if `activeRowId` is available
    
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRunning, activeRowId, counter, dispatch]);
}
