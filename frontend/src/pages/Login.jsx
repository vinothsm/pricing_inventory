import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { FaSignInAlt } from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
// import jwt_decode from "jwt-decode";


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
    })

  const { email, password} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      // console.log(jwt_decode(user.token));
      // const {exp} = jwt_decode(user.token)
      // console.log(exp, Date.now());
      // const expirationTime = (exp * 1000) - 60000
      // if(Date.now() >= expirationTime){
      //   toast.error('Your session has expired. Please login again.')
      //   dispatch(logout())
      // }

      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          Welcome! Please Login <FaSignInAlt />
        </h1>
      </section>
      <section className='form'>
      <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login