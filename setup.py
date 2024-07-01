from setuptools import setup

from Products.CustomZMI import __version__

setup(
    name='Products.CustomZMI',
    version=__version__,

    url='https://github.com/sashad/Products.CustomZMI.git/',
    author='Aleksandr Demidov',
    author_email='demidoff@1vp.ru',

    packages=['Products.CustomZMI'],
    package_data={
        '': ['configure.zcml'],
        # 'resources': ['*'],
    },
    include_package_data=True,
    install_requires=[
        'Zope>=5.5.0',
    ],
)
