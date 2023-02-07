import { useNavigate } from "react-router-dom"
import cookies from "react-cookies"
import { useCookieToRefresh } from "../"
import $ from "jquery"

const Logout = () => {
    const navigate = useNavigate();
    $.ajax({
        async: true, type: 'POST',
        url: "https://api.odoc-api.com/rest_auth/logout/",
        data: { "refresh": sessionStorage.getItem("refresh_token") }, 
        dataType: 'JSON',
        success: function (response) {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            sessionStorage.removeItem("user_pk");
            cookies.remove("access_token");
            cookies.remove("refresh_token");
            navigate("/login")
        },
        error: (response) => console.log(response),
    });
}

const useAccessTknRefresh = () => {
    const cookieToRefresh = useCookieToRefresh();
    const navigate = useNavigate();
    let result;
    $.ajax({
        async: false, type: 'POST',
        url: "https://api.odoc-api.com/api/token/refresh/",
        data: { "refresh": sessionStorage.getItem("refresh_token") },
        dataType: "json",
        success: (response) => result = response.access,
        error: function (response) {
            if (cookies.load("refresh_token")) { // expires session. use cookies
                result = cookieToRefresh();
                if (result == "error"){
                    alert("다시 로그인해 주세요")
                    navigate("/login")
                    Logout();
                }
                sessionStorage.setItem("access_token", result)
                sessionStorage.setItem("refresh_token", cookies.load("refresh_token"))
                sessionStorage.setItem("user_pk", localStorage.getItem("user_pk")) //change after
            }
            else{
                alert("다시 로그인해 주세요")
                navigate("/login")
                Logout();
            }
        }
    });
    return result
}

export default useAccessTknRefresh;
