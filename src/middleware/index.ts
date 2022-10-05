import urls from '../constants/json/urls.json';

export function middleware (ctx: any, next: any) {
    if (ctx.message?.text) {
        if (ctx.message.text.includes(urls.YOUTUBE)) {
            ctx.message.text = ctx.message.text.split('=')[1].split('&')[0]
            ctx.message.sender_chat = true;
        }
        if (ctx.message.text.includes(urls.YOUTUTBE_MOBILE)) {
            ctx.message.text = ctx.message.text.split('/')[3].split('?')[0]
            ctx.message.sender_chat = true;
        }
    }

    next()    
}