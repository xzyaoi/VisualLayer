class Item():
    def __init__(self, name, required=False):
        self.required = required
        self.name = name
        self.data = {}

    def set(self, k, v):
        self.name = k
        self.data[name] = v
    
    def getName(self):
        return self.name

    def get(self, k):
        try:
            return self.data[k]
        except:
            return False
    def validate(self):
        if not self.required:
            return True
        else:
            try:
                return self.data[self.name]
            except AttributeError:
                return False

class Config():
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def load_json(self, jsonObject):
        for k,v in jsonObject:
            

    def remove(self, index):
        pass


class Layer():
    def __init__(self):
        pass

    def fromJSON(self, jsonObject):
        # Must be implemented by Sub Classes
        raise NotImplementedError

class InputLayer(Layer):
    def __init__(self):
        pass
    def fromJSON(self):
        self.config = Config()

class DropoutLayer(Layer):
    def __init__(self):
        self.config = Config()
        keep = Item(required=True)
        self.config.add(keep)
    

    