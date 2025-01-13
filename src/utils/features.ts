

// ------------------------ Function to convert the second into formate [hh:mm:ss] 
 export const convertIntohoursAndMinuts = (seconds:number)=>{

 // value = 100
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 const remainingSeconds = seconds % 60;

 const format = (num: number) => String(num).padStart(2, "0");

 return `${format(hours)}:${format(minutes)}:${format(remainingSeconds)}`;






  }
// ------------------------ Function to convert the formate [hh:mm:ss] into seconds

  export const convertToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };