// 실제 위치 이용 수정 필요
import React, { useEffect, useState } from 'react';
import { Modal, CollisionWarning } from "../../component";
import { UrbrFront } from 'urbr_wasm';

const SILSMap = () => {
  const [from, setFrom] = useState(null);

  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const [modal1, setModal1] = useState(false);
  // let id = "917dc05a-56b8-4ceb-bbc4-9514e01bef83";
  const [id, setId] = useState("");
 // 연오한테서 SILS 속 위치 받아오기
  const getSILSGPS = async () => {
    const url = 'http://47.186.58.92:52804/tasks/1';

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Response from server:', response);

      const storedSessionUUID = sessionStorage.getItem("user_id");
      setId(storedSessionUUID);

      const data = await response.json();
      setLat(data.lat);
      setLng(data.lng);

      console.log('SILS GPS:', data.lat, data.lng);

      const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
      const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

      // 수행하고 나면 output에 100개가 담김
      urbr.inference(lat, lng, out_buffer);

      console.log(lat, lng, out_buffer);

      // 서버로 전송할 output
      setFrom(out_buffer);

      const url2 = 'http://localhost:8888/pedHandler'; // 엔드포인트 주소에 맞게 수정 47.186.58.92:52779

      try {
        const response = await fetch(url2, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            from: Array.from(out_buffer),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Retrieve session UUID from sessionStorage
        const storedSessionUUID = sessionStorage.getItem("user_id");
        // setSessionUUID(storedSessionUUID);

        // Check for collision
        checkForCollision(storedSessionUUID, data.pedestrianUUIDs);
        console.log('Response from server:', data.pedestrianUUIDs);
      } catch (error) {
        console.error('Error sending position to server:', error);
      }

    } catch (error) {
      console.error('Error getting position from SILS server:', error);
    }
  };
  useEffect(() => {
    // 현재 위치 가져오기 및 서버로 위치 전송
    const sendCurrentPositionToServer = async (position) => {
      const { latitude, longitude } = position.coords;

      // setId(sessionStorage.getItem("user_id"));
      // const storedSessionUUID = sessionStorage.getItem("user_id");
      //   setId(storedSessionUUID);
      // setSessionUUID(sessionStorage.getItem("user_id"));
      // const userID = sessionStorage.getItem('user_id');
      // console.log("id",id);
      setLat(latitude);
      setLng(longitude);

      const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
      const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

      // 수행하고 나면 output에 100개가 담김
      urbr.inference(lat, lng, out_buffer);

      console.log(lat, lng, out_buffer);

      // 서버로 전송할 output
      setFrom(out_buffer);

      console.log(lat, lng);

      const url = 'http://localhost:8888/pedHandler'; // 엔드포인트 주소에 맞게 수정 47.186.58.92:52779

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            from: Array.from(out_buffer),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Retrieve session UUID from sessionStorage
        

        // Check for collision
        // checkForCollision(storedSessionUUID, data.pedestrianUUIDs);
        console.log('Response from server:', data.pedestrianUUIDs);
      } catch (error) {
        console.error('Error sending position to server:', error);
      }
    };

    
    // 카카오 지도 렌더링
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng), // 서울의 위도, 경도
      level: 1, // 지도 확대 레벨
    };

    const map = new window.kakao.maps.Map(container, options);
    var markerPosition = new window.kakao.maps.LatLng(lat, lng);
    var marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    marker.setMap(map);
    
    // // 실제 위치 받아오기
    // navigator.geolocation.getCurrentPosition(
    //   sendCurrentPositionToServer,
    //   (error) => {
    //     console.error('Error getting current position:', error.message);
    //   }
    // );

    // // 위치 업데이트 주기 설정 (예: 1초마다)
    // const watchPositionOptions = { enableHighAccuracy: true, timeout: 500, maximumAge: 0 };
    // const watchPositionId = navigator.geolocation.watchPosition(
    //   (position) => {
    //     console.log("position", position.coords.latitude, position.coords.longitude);
    //     sendCurrentPositionToServer(position);
    //   },
    //   (error) => {
    //     console.error('Error watching position:', error.message);
    //   },
    //   watchPositionOptions
    // );
    // 0.5초 간격으로 fetchData 가상 위치 받아오기
    const intervalId = setInterval(getSILSGPS, 500);

    // 컴포넌트가 언마운트될 때 clearInterval을 통해 interval 정리
    return () => clearInterval(intervalId);

    // const urbr       = new UrbrFront       (); // LSTM 수행하는 객체 만들기
    // const out_buffer = UrbrFront.out_buffer(); // LSTM 출력 버퍼 (크기 100짜리 Float32Array)

    // // 수행하고 나면 output에 100개가 담김
    // urbr.inference(lat, lng, out_buffer);

    // console.log(lat, lng, out_buffer);

    // // 서버로 전송할 output
    // setOutput(out_buffer);

    
  }, [lat, lng]);

	function checkForCollision(sessionUUID, serverUUIDs) {
		// Check if session UUID is present in server UUIDs
		const isCollision = serverUUIDs.includes(sessionUUID);

		if (isCollision) {
		  // Trigger collision warning
		  setModal1(true);
		}
	}

  return (
    <>
    <div id="map" style={{ width: '100%', height: '100%' }}></div>
    <Modal open={modal1} className="customOverlay">
      <div id="popIngredient" className="layerPopup pop_ingredient">
          <div className="popup">
              <div className="p_head botm">
                  <button type="button" className="b-close btn_close" onClick={() => setModal1()}>
                      <span>x</span>
                  </button>
              </div>
            <CollisionWarning />
            {/* <PushNotification /> */}
            {/* <Vibration /> */}
          </div>
      </div>
    </Modal>
    </>
  );
};

export default SILSMap;
