function ErrorOnSubscribe() {
	const params = new URLSearchParams(window.location.search);

	switch (params.get("status")) {
		case "unauthorised":
			return <p>An unauthorised error has occurred.</p>;
		case "not-found":
			return <p>The user you are looking for does not exist.</p>;
		case "something-went-wrong":
			return <p>Something went wrong.</p>;
		default:
			return <p>Unkown error happened.</p>;
	}
}

export { ErrorOnSubscribe };
