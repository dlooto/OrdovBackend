# coding=utf-8
import base64
import hashlib
from Crypto.Cipher import AES


class Encrypt:

    pad_it = lambda s: s + (16 - len(s) % 16) * '\0'

    def __init__(self):
        pass

    def _md5(self, data):
        s = hashlib.md5(data.encode(encoding='UTF-8')).digest()
        return '{:04x}'.format(int.from_bytes(s, 'big', signed=True)).upper()

    def _md5_16(self, data):
        return self._md5(data)[8:24]

    def aes_encrypt(self, data, key):
        """

        :param data: 加密原始数据
        :param key: appSecret
        :return: 加密数据
        """
        key = key[0:16]
        iv = self._md5_16(key)
        generator = AES.new(key, AES.MODE_CBC, iv)
        crypt = generator.encrypt(Encrypt.pad_it(data))
        cryptedStr = base64.b64encode(crypt)
        return bytes.decode(cryptedStr)

    def decrypt_aes(self, cryptedData, key):
        """

        :param cryptedData: 加密后的数据
        :param key: appSecret
        :return: 解密后数据
        """
        key = key[0:16]
        iv = self._md5_16(key)
        generator = AES.new(key, AES.MODE_CBC, iv)
        cryptedStr = base64.b64decode(cryptedData)
        recovery = generator.decrypt(cryptedStr)
        decryptedStr = recovery.rstrip(b'\0')
        return bytes.decode(decryptedStr)

