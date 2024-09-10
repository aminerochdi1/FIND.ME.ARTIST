export function fetchLang() {
    return window.location.pathname.split("/")[1];
}

export function buildMediaURL(path:string){
    if(path == undefined)return "<path=undefined>";
    if(path.startsWith("/"))
        return path;
    return "/api/image/get?name=" + path;
}

/**
 * 
 * Ancienne méthode utiliser pour miniaturiser les images, NextJS fourni un composant 
 * uniquement pour ça
 * 
 * @param path 
 * @param width 
 * @param height 
 * @returns 
 */
export function buildMediaThumbnailURL(path:string, width: number, height: number){
    if(path == undefined)return "<path=undefined>";
    if(path.startsWith("/"))
        return path;
    return "/api/image/get?name=" + path+"&width="+width+"&height="+height;
}