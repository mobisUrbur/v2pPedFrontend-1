import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import $ from "jquery";

const Login = () => {
	const navigate = useNavigate();
	const [leftBox, setLeftBox] = useState(false);
	const [rightBox, setRightBox] = useState(false);
	const onChangeLeftBox = () => { setLeftBox(!leftBox); };
	const onChangeRightBox = () => { setRightBox(!rightBox); };
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const errorRef = useRef(null);

	useEffect(() => {
		document.getElementById('NotLoading').style.display = "none";
		if (cookies.load("refresh_token")) {
			setLeftBox(true);
		}
		else {
			if (cookies.load("email")) {
				setEmail(cookies.load("email"));
				setRightBox(true);
			}
			document.getElementById('loading').style.display = "none";
			document.getElementById('NotLoading').style.display = "block";
		}
		sessionStorage.removeItem("policy_checked");
	}, []);

	const onSignIn = async () => {
		const url = 'http://localhost:8888/login';
        try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!response.ok) {
            	throw new Error(`HTTP error! Status: ${response.status}`);
			}
			
			const data = await response.json();
			// console.log('Response from server:', data);
			alert("로그인 되었습니다.");

			sessionStorage.setItem("access_token", data.accessToken);
			sessionStorage.setItem("refresh_token", data.refreshToken);
			sessionStorage.setItem("user_id", data.id);
			
			if (leftBox) {
				let day = new Date();
				let time = new Date();
				day.setDate(day.getDate() + 7);
				time.setHours(time.getHours() + 2);
				cookies.save('access_token', data.accessToken, { expires: time });
				cookies.save('refresh_token', data.refreshToken, { expires: day });
				localStorage.setItem("user_pk", data.id); // change after
			}
			else {
				cookies.remove('access_token');
				cookies.remove('refresh_token');
				localStorage.removeItem("user_pk"); // change after
			}
			if (rightBox) {
				let day = new Date();
				day.setDate(day.getDate() + 7);
				cookies.save("email", email, { expires: day });
			}
			else cookies.remove("email");
			navigate("/main");
        } catch (error) {
			console.error('Error sending position to server:', error);
        }
	};

	const emailChange = () => {
		setEmail(document.getElementById('email').value);
		$($(errorRef.current).next()[0]).addClass("hidden");
	};

	const passwordChange = () => {
		setPassword(document.getElementById('password').value);
		$($(errorRef.current).next()[0]).addClass("hidden");
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') onSignIn();
	};

	return (
		<>
			<div id="loading">
 				<img src={require("../../assets/images/urburLoading.png")} style={{ width: '100%' }} />
 			</div>
			<div id="NotLoading" style={{ display: 'none' }}>
				<header id="header" className="header">
					<div className="inr-c">
						<h2 className="tit">로그인</h2>
						<div className="lft">
							<button type="button" className="btn-back c-white" onClick={() => navigate(-1)}>
								<span className="i-aft i_back">뒤로</span>
							</button>
						</div>
					</div>
				</header>

				<div id="container" className="container sub member">
					<div className="inr-c">
						<div className="area_member login">

							<div className="mb20">
								<span className="ico"><i className="i-set i_id"></i></span>
								<input type="text" id="email" className="inp_txt w100p" placeholder="이메일 주소를 입력해 주세요"
									value={email} onChange={emailChange} />
							</div>
							<div className="mb30" ref={errorRef}>
								<span className="ico"><i className="i-set i_pw"></i></span>
								<input type="password" id="password" className="inp_txt w100p" placeholder="비밀번호를 입력해 주세요"
									value={password} onChange={passwordChange} onKeyDown={handleKeyPress} />
							</div>
							<p className="t_error mb30 hidden">아이디와 비밀번호를 정확하게 입력해주세요.</p>
							<br/>
							<div className="mb10" style={{"marginTop": "-4vw"}}>
								<label className="inp_checkbox2 mr60 va-t">
									<input type="checkbox" checked={leftBox} onChange={onChangeLeftBox} />
									<span>로그인 유지하기</span>
								</label>
								<label className="inp_checkbox2 va-t">
									<input type="checkbox" checked={rightBox} onChange={onChangeRightBox} />
									<span>아이디 기억하기</span>
								</label>
							</div>
							<button type="button" onClick={onSignIn} className="btn-pk s blue w100p bdrs" style={{"marginTop": "2vw"}}><span>로그인</span></button>
							<div className="t_txt mt40">
								<p className="l">아직 회원이 아니시다면?</p>
								<p className="r"><Link to="/policy" className="c-blue">회원가입</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;