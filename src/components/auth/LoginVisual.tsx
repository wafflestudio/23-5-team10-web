import loginLeftImage from '../../assets/login-left_image.png'

const LoginVisual = () => {
  return (
    <div className="hidden h-[585px] w-[465px] items-center justify-end md:flex">
      <img
        src={loginLeftImage}
        alt="Instagram login visual"
        className="h-full object-contain"
      />
    </div>
  )
}

export default LoginVisual
