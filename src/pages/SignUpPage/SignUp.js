import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

const SignUp = () => {
    const navigate = useNavigate();
    const [email1, setEmail1] = useState("");
    const [email2, setEmail2] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [gender, setGender] = useState("");
    const [region, setRegion] = useState("");
    const [disabled, setDisabled] = useState(false);
    const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

    useEffect(() => {
        if (email1 !== "" && email2 !== "") {
            document.getElementById("emailerror1").className = "hidden";
            document.getElementById("email_in_use").className = "hidden";
        }
    }, [email1, email2]);

    useEffect(() => {
        onChangePassword();
    }, [password1, password2]);

    const onChangePassword = () => {
        document.getElementById('pwderror2').className = "hidden";
        document.getElementById('pwderror3').className = "hidden";
        document.getElementById('pwdok').className = "hidden";
        if (password1.length && (password1.length > 20 || password1.length < 8)) {
            document.getElementById('pwdlengtherror').className = "t_error";
            document.getElementById('pwderror5').className = "hidden";
        } else {
            document.getElementById('pwdlengtherror').className = "hidden";
            if (password2.length === 0) {
                document.getElementById('pwderror5').className = "hidden";
            } else if (password1 !== password2) {
                document.getElementById('pwderror5').className = "t_error";
            } else {
                document.getElementById('pwderror5').className = "hidden";
                document.getElementById('pwdok').className = "t_comp";
            }
        }
    };

    const fieldCheck = () => {
        let flag = false;
        document.getElementById("email_in_use").className = "hidden";
        document.getElementById("emailerror1").className = "hidden";
        document.getElementById("emailerror2").className = "hidden";
        document.getElementById("pwdlengtherror").className = "hidden";
        document.getElementById("pwderror1").className = "hidden";
        document.getElementById("pwderror2").className = "hidden";
        document.getElementById("pwderror3").className = "hidden";
        document.getElementById("pwderror4").className = "hidden";
        document.getElementById("pwderror5").className = "hidden";
        document.getElementById("gendererror1").className = "hidden";
        document.getElementById("regionerror1").className = "hidden";
        if (email1 === "" || email2 === "") {
            document.getElementById("emailerror1").className = "t_error";
            flag = true;
        } else if (!emailRegex.test(email1 + '@' + email2)) {
            document.getElementById("emailerror2").className = "t_error";
            flag = true;
        }
        if (password1 !== password2) {
            document.getElementById("pwderror4").className = "t_error";
            flag = true;
        }
        if (gender === "") {
            document.getElementById("gendererror1").className = "t_error";
            flag = true;
        }
        if (region === "") {
            document.getElementById("regionerror1").className = "t_error";
            flag = true;
        }
        if (flag) return false;
        else return true;
    };

    const register = async () => {
        const url = 'http://localhost:8888/signup'; // 엔드포인트 주소에 맞게 수정
        const email = email1 + "@" + email2;
        console.log(email, password1, gender, region);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password1, gender, region,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response from server:', data);
            alert("회원가입이 완료되었습니다.");
            navigate("/login");
            localStorage.setItem("userId", response.id);
            sessionStorage.removeItem("policy_checked");
        } catch (error) {
            console.error('Error sending position to server:', error);
        }
    };

    return (
        <div>
            <header id="header" className="header">
                <div className="inr-c">
                    <h2 className="tit">회원가입</h2>
                    <div className="lft">
                        <button type="button" className="btn-back c-white" onClick={() => navigate(-1)}>
                            <span className="i-aft i_back">뒤로</span>
                        </button>
                    </div>
                </div>
            </header>
            <div id="container" className="container sub member">
                <div className="inr-c">
                    <div className="area_member">
                        <h2 className="h_tit2 mb40">필수 정보를 입력해 주세요</h2>
                        <div className="box-inp">
                            <div>
                                <label htmlFor="email">이메일</label>
                                <div className="inp_email">
                                    <input type="text" className="inp_txt" value={email1}
                                        onChange={(e) => {
                                            setEmail1(e.target.value);
                                        }} />
                                    <span>@</span>
                                    <input type="text" className="inp_txt" value={email2} disabled={disabled}
                                        onChange={(e) => {
                                            setEmail2(e.target.value);
                                        }} />
                                    <select className="select1"
                                        onChange={(e) => {
                                            if (e.target.value !== "") setDisabled(true);
                                            else setDisabled(false);
                                            setEmail2(e.target.value);
                                        }}>
                                        <option value="">직접입력</option>
                                        <option value="naver.com">네이버</option>
                                        <option value="hanmail.net">다음</option>
                                        <option value="nate.com">네이트</option>
                                        <option value="gmail.com">구글</option>
                                        <option value="kakao.com">카카오</option>
                                    </select>
                                </div>
                                <p id="email_in_use" className="t_error hidden">사용중인 이메일 주소입니다</p>
                                <p id="emailerror1" className="t_error hidden">이메일을 입력해주세요</p>
                                <p id="emailerror2" className="t_error hidden">이메일을 정확하게 입력해주세요.</p>
                            </div>
                            <div>
                                <label htmlFor="password">비밀번호</label>
                                <input type="password" placeholder="8~20자 이내의 영문, 숫자를 입력하세요"
                                    onChange={(e) => {
                                        document.getElementById("pwderror1").className = "hidden";
                                        setPassword1(e.target.value);
                                    }} />
                                <p id="pwdlengtherror" className="t_error hidden">8~20자 이내의 영문, 숫자를 입력하세요</p>
                                <p id="pwderror1" className="t_error hidden">비밀번호를 입력해주세요</p>
                                <p id="pwderror2" className="t_error hidden">비밀번호가 너무 일상적인 단어입니다</p>
                                <p id="pwderror3" className="t_error hidden">비밀번호가 전부 숫자로 되어 있습니다</p>
                            </div>
                            <div>
                                <input type="password" placeholder="비밀번호를 다시한번 입력하세요"
                                    onChange={(e) => {
                                        document.getElementById("pwderror4").className = "hidden";
                                        setPassword2(e.target.value);
                                    }} />
                                <p id="pwderror4" className="t_error hidden">비밀번호를 다시한번 입력해주세요</p>
                                <p id="pwderror5" className="t_error hidden">비밀번호가 일치하지 않습니다</p>
                                <p id="pwdok" className="t_comp hidden">비밀번호가 일치합니다</p>
                            </div>

                            <div className="inp_gender_region">
                                <div>
                                    <label htmlFor="gender">성별</label>
                                    <input type="hidden" />
                                    <select className="select1"
                                        onChange={(e) => {
                                            document.getElementById("gendererror1").className = "hidden";
                                            setGender(e.target.value);
                                        }}>
                                        <option value="">선택</option>
                                        <option value="남성">남성</option>
                                        <option value="여성">여성</option>
                                    </select>
                                    <p id="gendererror1" className="t_error hidden">성별을 선택해주세요</p>
                                </div>
                                <span /> {/* margin */}
                                <div>
                                    <label htmlFor="region">지역</label>
                                    <input type="hidden" />
                                    <select className="select1"
                                        onChange={(e) => {
                                            document.getElementById("regionerror1").className = "hidden";
                                            setRegion(e.target.value);
                                        }}>
                                        <option value="">선택</option>
                                        <option value="서울">서울</option>
                                        <option value="경기">경기</option>
                                        <option value="인천">인천</option>
                                        <option value="부산">부산</option>
                                        <option value="대전">대전</option>
                                        <option value="광주">광주</option>
                                        <option value="대구">대구</option>
                                        <option value="울산">울산</option>
                                        <option value="강원">강원</option>
                                        <option value="충북">충북</option>
                                        <option value="충남">충남</option>
                                        <option value="전북">전북</option>
                                        <option value="전남">전남</option>
                                        <option value="경북">경북</option>
                                        <option value="경남">경남</option>
                                        <option value="제주">제주</option>
                                        <option value="세종">세종</option>
                                    </select>
                                    <p id="regionerror1" className="t_error hidden">지역을 선택해주세요</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="fix_botm">
                    <button type="button" className="btn-pk blue n"
                        onClick={() => {
                            if (fieldCheck() == false) return;
                            register();
                        }}>
                        <span>가입완료</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;