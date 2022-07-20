export interface UserTypes {
    about: {
        id: number | undefined;
        first_name: string | undefined;
        last_name: string | undefined;
        username: string | undefined;
        is_bot: boolean | undefined;
    },
    data: {
        favorites: string[]
    },
    register_date: string
}

