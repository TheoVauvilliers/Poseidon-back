import dotenv from 'dotenv'
import fetch from 'cross-fetch'
dotenv.config()

export const baseUri = '//api.twitch.tv/helix/'
export const baseUriTmi = '//tmi.twitch.tv/group/'

const getAuthToken = async () => {
    const response = await fetch(`//id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    })

    if (response.status >= 400) {
        return { code: response.status, message: 'An error occurred - bad request to get access token' }
    }

    const data = await response.json()

    // { access_token: 'XXX', expires_in: int, token_type: 'bearer' }
    return data
}

export const getHeaders = async () => {
    let authToken;

    if (process.env.TWITCH_TOKEN) {
        authToken = process.env.TWITCH_TOKEN
    } else {
        authToken = await getAuthToken()
        authToken = authToken.access_token
    }

    return {
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Client-Id': process.env.TWITCH_CLIENT_ID
        }
    }
}