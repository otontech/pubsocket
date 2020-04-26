import PubSocket from '../src/Server';
import PubClient from '../src/Client';

describe('PubSocketClient', () => {
	let pubSocket: PubSocket;
	let client: PubClient;

	beforeAll(async () => {
		pubSocket = new PubSocket();
		pubSocket.createChannel('ROOM1');
		pubSocket.createChannel('ROOM2');

		client = new PubClient();
		await client.connect('http://localhost:3000', 'ROOM1');
	})

	beforeEach(() => {
		if (client.isConnected()) {
			client.clearListeners();
		}
	})

	afterAll(async () => {
		await client.disconnect();
		await pubSocket.close();
	});

	it('add listener', () => {
		const listener1 = () => { return true; };
		const listener2 = () => { return false; };
		client.addListener(listener1);
		const listeners = client.addListener(listener2);
		expect(listeners).toStrictEqual([listener1, listener2]);
	})

	it('clear listener', () => {
		const listener1 = () => { return true; };
		const listener2 = () => { return false; };
		client.addListener(listener1);
		client.addListener(listener2);
		const listeners = client.removeListener(listener1);
		expect(listeners).toStrictEqual([listener2]);
	});

	it('change channel', async () => {
		const seted = await client.setChannel('ROOM2');
		expect(seted).toBe(true);
	});

	it('invalid change channel', async () => {
		const seted = await client.setChannel('ROOM3');
		expect(seted).toBe(false);
	});

	it('is connected', async () => {
		expect(client.isConnected()).toBe(true);
		await client.disconnect();
		expect(client.isConnected()).toBe(false);
	})

	it('publish and receive', async () => {
		await client.connect('http://localhost:3000', 'ROOM1');
		expect(client.isConnected()).toBe(true);

		const channel = pubSocket.getChannel('ROOM1');
		const SERVER_MESSAGE = "server message";
		const CLIENT_MESSAGE = "client message";
		let channelMessages = new Array<string>();
		let clientMessages = new Array<string>();

		channel?.addListener((msg: string) => { channelMessages.push(msg) });
		client.addListener((msg: string) => { clientMessages.push(msg) });

		channel?.publish(SERVER_MESSAGE);
		client.publish(CLIENT_MESSAGE);

		setTimeout(() => {
			expect(channelMessages).toStrictEqual([SERVER_MESSAGE, CLIENT_MESSAGE]);
			expect(clientMessages).toStrictEqual([SERVER_MESSAGE, CLIENT_MESSAGE]);
		}, 5000);
	});
})