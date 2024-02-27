const host: string = window.location.hostname ;
export let isLocal: boolean;
export let frontendURL: string;
export let backendURL: string;
export let socketIoHost: string;
const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

if (host === "localhost" || ipRegex.test(host)) {
    isLocal = true;
    frontendURL = "http://"+host+":8080/";
    backendURL = "http://"+host+":3000/";
    socketIoHost = backendURL;
}else{
    isLocal = false;
    frontendURL = "https://blubb.io/";
    socketIoHost = frontendURL;
    backendURL = "https://blubb.io/blubbio-backend/"
}

export function getDefaultProfilePbURL(){
    return require(`@/img/default/pbPlaceholder.png`);
}

export function getDefaultProfileBannerURL(){
    return require(`@/img/default/bannerPlaceholder.png`);
}