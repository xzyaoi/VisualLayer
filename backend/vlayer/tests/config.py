import unittest

import sys
sys.path.append('..')

from utils.config import Item

class ItemTester(unittest.TestCase):
    def testEmptyRequire(self):
        i = Item(required=True)
        self.assertFalse(i.validate())

    def testNotRequire(self):
        i = Item(required=False)
        self.assertTrue(i.validate())

    def testRequire(self):
        i = Item(required=True)
        i.set('name', 'inputLayer')
        self.assertTrue(i.validate())


if __name__ == '__main__':
    unittest.main()