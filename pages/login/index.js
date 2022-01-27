import axios from "axios";
import Link from "next/link";
import { useRef } from "react";
import Router from "next/router";

import { useAuth } from "../../components/built/context";
import { Form, FormGroup } from "../../components/form";
import { Input } from "../../components/input";
import Button from "../../components/button";
import { MxCanvas, RenderBox } from "../../components/built/box_3d";

export default function login() {
    const { Login } = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();

    async function SubmitForm(e) {
        e.preventDefault();

        await Login(emailRef.current.value, passwordRef.current.value);

        // TODO: Check for errors and display them
        Router.push("/");
    }

    return (
        <div className="page-container">
            <div className="page-wrapper-full">
                <Form onSubmit={SubmitForm}>
                    <h1>Login</h1>
                    <FormGroup>
                        <Input required type="email" ref={emailRef} placeholder="Email" />
                        <Input required type="password" ref={passwordRef} placeholder="Password" />
                    </FormGroup>
                    <FormGroup final>
                        <Button type="submit">Login</Button>
                        <Link href="/login/signup">Signup Page</Link>
                    </FormGroup>
                </Form>
                <div className="box">
                    <MxCanvas>
                        {RenderCubes().map((cube) => {
                            return cube;
                        })}
                    </MxCanvas>
                </div>
            </div>
        </div>
    )
}

// Creates and randomizes cube positions
function RenderCubes() {
    const cubes = [];
    <RenderBox position={[0, 0, 0]} />
    for (let i = 0; i < 25; i++) {
        cubes.push(<RenderBox key={getRandomNum(-10000, 10000)} 
        position={[
            getRandomNum(-5, 5),
            getRandomNum(-5, 5),
            getRandomNum(-5, 5)
        ]} />)
    }

    return cubes;
}

// Returns random number between a range
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}