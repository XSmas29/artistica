
import { io } from 'socket.io-client'

const ioClient = io(import.meta.env.VITE_WEBSOCKET_URL, {
	transports: ['websocket'],
	auth: {
		token: localStorage.getItem('token') || '',
	}
})
ioClient.on('connect', () => {
	console.log('connected')
})

ioClient.on('disconnect', () => {
	console.log('disconnected')
})

ioClient.on('error', err => {
	console.log(err)
})

ioClient.on('broadcast_message', args => {
	console.log(args)
})

export default ioClient
