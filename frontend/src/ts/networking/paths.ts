const host: string = window.location.host;
export let isLocal: boolean;
export let frontendURL: string;
export let backendURL: string;

if (host === "localhost:8080") {
    isLocal = true;
    frontendURL = "localhost:8080/";
    backendURL = "localhost:3000/"
}else{
    isLocal = false;
    frontendURL = "blubb.io/";
    backendURL = "blubb.io/blubbio-backend/"
}

export function getProfilePicURL(){
    return backendURL + "pb/";
}