import {urls} from "../../constants/urls";

export const parseInputText = (text: string): string => {
    if (text.includes(urls.YOUTUBE)) {
        return text.split('=')[1].split('&')[0]
    }
    if (text.includes(urls.YOUTUTBE_MOBILE)) {
        return  text.split('/')[3].split('?')[0]
    }

    return text
}