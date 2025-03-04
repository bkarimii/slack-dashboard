function ErrorOnSubscribe() {
	const params = new URLSearchParams(window.location.search);

	switch (params.get("status")) {
		case "unauthorised":
			return <p>An unauthorised error has occurred.</p>;
		case "not-found":
			return <p>user not found</p>;
		case "something-went-wrong":
			return <p>Something went wrong.</p>;
		case "duplicate":
			return <p>the email address you entred already exist.</p>;
		default:
			return <p>Unkown error happened.</p>;
	}
}

export { ErrorOnSubscribe };
