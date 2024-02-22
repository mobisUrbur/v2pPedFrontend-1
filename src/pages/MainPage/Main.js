import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
// import { useIsMounted } from "../../hooks"
import { useAccessTknRefresh, useLogout } from "../../hooks";
import { Footer, SILSMap, MainMap } from "../../component";
import $ from "jquery";

const Main = () => {
	// const isMounted = useIsMounted()
	const location = useLocation();

	// useEffect(() => {
	// 	if (sessionStorage.getItem("access_token") === undefined)
	// 		sessionStorage.removeItem("access_token");
	// 	fetchServerUUIDs();
	// }, []);


	/* coloring bottom navigation bar icons */
	useEffect(() => {
		const pathname = location.pathname;
		if (pathname.startsWith("/test")) $("#fmenu1").addClass("on");
		else if (pathname.startsWith("/MyMap")) $("#fmenu2").addClass("on");
		else if (pathname.startsWith("/main")) $("#fmenu3").addClass("on");
		else if (pathname.startsWith("/search")) $("#fmenu4").addClass("on");
		else if (pathname.startsWith("/mypage")) $("#fmenu5").addClass("on");
	}, []);

	return (
		<div style={{width: "98%", marginLeft: "1%"}}>
			<header id="header" className="header">
				<div className="inr-c">
					<h2 className="h_tit1" style={{marginLeft: "-5%", width: "110%", textAlign: "center", fontSize: "7vw", color: "#012D74", boxShadow: " 0 4px 4px -4px"}} >URBUR</h2>
				</div>
			</header>
			<div id="container" className="container main" style={{width: "98%", marginLeft: "1%"}}>
			<div className="inr-c">
					{/* <h2 className="h_tit1"><span><strong className="c-blue">{username}</strong>현재 위치</span></h2> */}
					<div className="lst_prd pr-mb2" style={{height: "50%", marginTop: "5%"}}>
						{
							<div className="item">
							<div className="thumb">
								<SILSMap />
							</div>
						</div>
						}

					</div>
					<div>
                <div style={{backgroundColor: "transparent", marginBottom: "-18vw"}}>
                    {/* <button type="button" className="btn_bmore2" onClick={() => handleButtonClick1()}><span className="i-aft">&nbsp; 충돌 경고 </span></button> */}
                </div>
            </div>
			</div>
			{
				<Footer />
			}
			</div>
			</div>
	);
};

export default Main;
// {/* <button type="button" className="btn_bmore2" onClick={() => handleButtonClick1()}><span className="i-aft">&nbsp; 충돌 경고 </span></button> */}
// <Modal open={modal1} className="customOverlay">
//                         <div id="popIngredient" className="layerPopup pop_ingredient">
//                             <div className="popup">
//                                 <div className="p_head botm">
//                                     <button type="button" className="b-close btn_close" onClick={() => setModal1()}>
//                                         <span>x</span>
//                                     </button>
//                                 </div>
// 								<CollisionWarning />
// 								{/* <PushNotification /> */}
// 								{/* <Vibration /> */}
//                             </div>
//                         </div>
//                     </Modal>