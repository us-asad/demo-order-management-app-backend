import {connect} from 'mongoose'

export const CONNECT_DB = async () => {
  try {
    const {connections} = await connect(process.env.DB_URL as string)
    console.warn(`⚡️[DB]: Name:${connections[0].name}; Port:${connections[0].port}; Host:${connections[0].host};`)
  } catch (err) {
    console.warn(err)
  }
}
