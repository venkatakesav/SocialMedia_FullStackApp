import React from 'react'
import { useForm } from '../../shared/hooks/form-hook'
import { useState, useContext } from "react"
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { AuthContext } from '../../shared/context/auth-context'

// import { useForm } from '../../shared/hooks/form-hook'

import './Auth.css'


function Auth() {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [isLoginMode, setIsLoginMode] = useState(true)
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();
        // console.log(formState.inputs)
        if (isLoginMode) {
            try {
                const response = await sendRequest('http://localhost:5000/api/users/login', 'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token

                    })
                auth.login(response.userId, response.token)
            }
            catch (err) {

            }
        }
        else {
            try {
                const response = await sendRequest('http://localhost:5000/api/users/signup', 'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                        age: formState.inputs.age.value,
                        contact: formState.inputs.contact.value
                    }), {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
                );
                auth.login(response.userId, response.token)
            } catch (err) {

            }
        }
        // console.log(auth.isLoggedIn)
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
            }, false)
        }

        setIsLoginMode(prevMode => !prevMode)
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <h2>Login Required</h2>
                <hr></hr>
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && <Input element="input" id="name" type="text" label="Name" validators={[VALIDATOR_REQUIRE()]}
                        errorText="Don't You Have a Name ;)" onInput={inputHandler}></Input>}
                    <Input element="input" id="email" type="email" label="Email"
                        validators={[VALIDATOR_EMAIL()]} errorText="Please enter a valid email address"
                        onInput={inputHandler} ></Input>
                    <Input element="input" id="password" type="password" label="Password"
                        validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid Password (At least 5 Characters)"
                        onInput={inputHandler} ></Input>
                    {!isLoginMode && <Input element="input" id="age" label="Age" type="text" validators={[VALIDATOR_MINLENGTH(1)]} errorText="Please enter a valid Age"
                        onInput={inputHandler} ></Input>}
                    {!isLoginMode && <Input element="input" id="contact" type="text" label="Contact"
                        validators={[VALIDATOR_MINLENGTH(10)]} errorText="Please enter a valid Contact Phone Number"
                        onInput={inputHandler} ></Input>}
                    <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
    )
}
export default Auth