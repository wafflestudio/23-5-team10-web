import { instance } from './ky'

export const getTest = async () => {
  const response = await instance.get('actuator/health')
  return response.json()
}
