import PubSocket from '../src/Server';
import Channel from '../src/Server/Channel';

describe('PubSocketServer', () => {

	let pubSocket: PubSocket;

	beforeAll(() => {
		pubSocket = new PubSocket();
	})

	beforeEach(() => {
		pubSocket.clearChannels();
	})

	afterAll(async () => {
		await pubSocket.close();
	});

	it('create a channel', () => {
		const channel = pubSocket.createChannel('ROOM');
		expect(channel instanceof Channel).toBe(true);
	});

	it('get channels', () => {
		const channel1 = pubSocket.createChannel('ROOM_1');
		const channel2 = pubSocket.createChannel('ROOM_2');

		expect(pubSocket.getChannels()).toStrictEqual([channel1, channel2]);
		expect(pubSocket.getChannel('ROOM_1')).toStrictEqual(channel1);
	});

	it('get invalid channel', () => {
		expect(pubSocket.getChannel('INVALID')).toBe(null);
	});

	it('is valid channel', () => {
		const channel = new Channel('HOME', pubSocket.io);
		expect(pubSocket.isValidChannel(channel)).not.toBe(null);
	});

	it('is invalid channel same name', () => {
		pubSocket.createChannel('ROOM_1');
		const testChannel = new Channel('ROOM_1', pubSocket.io);
		expect(() => pubSocket.isValidChannel(testChannel)).toThrow()
	});

	it('is invalid channel same instance', () => {
		const testChannel = new Channel('ROOM_1', pubSocket.io);
		expect(pubSocket.addChannel(testChannel)).not.toBe(null);
		const copyChannel = testChannel;
		expect(pubSocket.addChannel(copyChannel)).toBe(null);
	});

	it('get channels names', () => {
		pubSocket.createChannel('ROOM_1');
		pubSocket.createChannel('ROOM_2');
		expect(pubSocket.getChannelsNames()).toStrictEqual(['ROOM_1', 'ROOM_2']);
	});

	it('clear channels', async () => {
		pubSocket.createChannel('ROOM_1');
		pubSocket.createChannel('ROOM_2');
		pubSocket.clearChannels();
		expect(pubSocket.getChannels()).toStrictEqual([]);
	});

})