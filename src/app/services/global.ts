import { BaseObject } from "./base";
import { authApi } from "./auth";

export interface Aztro {
    name: string;
    element: string;
    stone: string;
    symbol: string;
    dateMin: string;
    dateMax: string;
    date_range: string;
    current_date: string;
    description: string;
    compatibility: string;
    mood: string;
    color: string;
    lucky_number: string;
    lucky_time: string;
    photo: string;
}

export const globalApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getLanguages: builder.query<BaseObject[], string | undefined>({
            query: (language) => ({ url: `global/${language}/languages` }),
            //TODO New Lang Tag?
            providesTags: (result, error) => ["Group"]
        }),
        getCurrencies: builder.query<BaseObject[], string | undefined>({
            query: (language) => ({ url: `global/${language}/currencies` }),
            //TODO New Lang Tag?
            providesTags: (result, error) => ["Group"]
        }),

        getAztro: builder.query<Aztro, { language?: string; birthday: Date }>({
            query: (params) => ({ url: `global/${params.language}/aztro/${new Date(params.birthday).toJSON()}` })
        }),

        getEmojiPhoto: builder.query<string, string>({
            query: (emoji) => ({ url: `global/emojiPhoto/${emoji}` })
        })
    })
});
