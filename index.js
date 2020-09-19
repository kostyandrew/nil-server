import React, { useState, useEffect } from "react"
import http from "http";
import { render } from "react-nil"
import { nanoid } from "nanoid";

function Foo() {
	const [queue, setQueue] = useState([]);
	const clearRequest = (id) => setQueue(queue => queue.filter(item => item._id !== id));

	const requestListener = (request, response) => {
		const _id = nanoid();
		request.on('end', () => clearRequest(_id));
		setQueue(queue => [...queue, {_id, request, response}]);
	}

	useEffect(() => {
		http.createServer(requestListener).listen(8000);
	},[]);

	return <Requests queue={queue}/>
}

const Requests = ({queue}) => queue.map(request => <Request key={request._id} {...request}/>)

const Request = (props) => {
	const response = props.response;
	const [i, setI] = useState(0);
	useEffect(() => {
		response.setHeader("Content-Type", "text/html; charset=utf-8;");
		response.writeHead(200);
	}, []);

	useEffect(() => {
		if(i < 10) {
			response.write(`${i}<br>`);
			setI(i => i+1);
		} else {
			response.end('Hello, World!');
		}
	}, [i]);
	return null;
}

render(<Foo/>)