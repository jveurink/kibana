/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../../ftr_provider_context';

export default function ({ getService }: FtrProviderContext) {
  const supertest = getService('supertest');

  describe('main', () => {
    it('can update multiple fields', async () => {
      const title = `foo-${Date.now()}-${Math.random()}*`;
      const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
        index_pattern: {
          title,
        },
      });

      expect(response1.status).to.be(200);
      expect(response1.body.index_pattern.fieldAttrs.foo).to.be(undefined);
      expect(response1.body.index_pattern.fieldAttrs.bar).to.be(undefined);

      const response2 = await supertest
        .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
        .send({
          fields: {
            foo: {
              count: 123,
              customLabel: 'test',
            },
            bar: {
              count: 456,
            },
          },
        });

      expect(response2.status).to.be(200);
      expect(response2.body.index_pattern.fieldAttrs.foo.count).to.be(123);
      expect(response2.body.index_pattern.fieldAttrs.foo.customLabel).to.be('test');
      expect(response2.body.index_pattern.fieldAttrs.bar.count).to.be(456);

      const response3 = await supertest.get(
        `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
      );

      expect(response3.status).to.be(200);
      expect(response3.body.index_pattern.fieldAttrs.foo.count).to.be(123);
      expect(response3.body.index_pattern.fieldAttrs.foo.customLabel).to.be('test');
      expect(response3.body.index_pattern.fieldAttrs.bar.count).to.be(456);
    });

    describe('count', () => {
      it('can set field "count" attribute on non-existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo).to.be(undefined);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                count: 123,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.count).to.be(123);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.count).to.be(123);
      });

      it('can update "count" attribute in index_pattern attribute map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldAttrs: {
              foo: {
                count: 1,
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo.count).to.be(1);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                count: 2,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.count).to.be(2);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.count).to.be(2);
      });

      it('can delete "count" attribute from index_pattern attribute map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldAttrs: {
              foo: {
                count: 1,
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo.count).to.be(1);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                count: null,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.count).to.be(undefined);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.count).to.be(undefined);
      });

      it('can set field "count" attribute on an existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fields: {
              foo: {
                name: 'foo',
                type: 'string',
                count: 123,
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response1.body.index_pattern.fields.foo.count).to.be(123);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                count: 456,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response2.body.index_pattern.fields.foo.count).to.be(456);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response3.body.index_pattern.fields.foo.count).to.be(456);
      });
    });

    describe('customLabel', () => {
      it('can set field "customLabel" attribute on non-existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo).to.be(undefined);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                customLabel: 'foo',
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.customLabel).to.be('foo');

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.customLabel).to.be('foo');
      });

      it('can update "customLabel" attribute in index_pattern attribute map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldAttrs: {
              foo: {
                customLabel: 'foo',
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo.customLabel).to.be('foo');

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                customLabel: 'bar',
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.customLabel).to.be('bar');

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.customLabel).to.be('bar');
      });

      it('can delete "customLabel" attribute from index_pattern attribute map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldAttrs: {
              foo: {
                customLabel: 'foo',
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo.customLabel).to.be('foo');

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                customLabel: null,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo.customLabel).to.be(undefined);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo.customLabel).to.be(undefined);
      });

      it('can set field "customLabel" attribute on an existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fields: {
              foo: {
                name: 'foo',
                type: 'string',
                count: 123,
                customLabel: 'foo',
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response1.body.index_pattern.fields.foo.customLabel).to.be('foo');

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                customLabel: 'baz',
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response2.body.index_pattern.fields.foo.customLabel).to.be('baz');

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldAttrs.foo).to.be(undefined);
        expect(response3.body.index_pattern.fields.foo.customLabel).to.be('baz');
      });
    });

    describe('format', () => {
      it('can set field "format" attribute on non-existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldFormats.foo).to.be(undefined);

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                format: {
                  id: 'bar',
                  params: { baz: 'qux' },
                },
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar',
          params: { baz: 'qux' },
        });

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar',
          params: { baz: 'qux' },
        });
      });

      it('can update "format" attribute in index_pattern format map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldFormats: {
              foo: {
                id: 'bar',
                params: {
                  baz: 'qux',
                },
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar',
          params: {
            baz: 'qux',
          },
        });

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                format: {
                  id: 'bar-2',
                  params: { baz: 'qux-2' },
                },
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar-2',
          params: { baz: 'qux-2' },
        });

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar-2',
          params: { baz: 'qux-2' },
        });
      });

      it('can remove "format" attribute from index_pattern format map', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fieldFormats: {
              foo: {
                id: 'bar',
                params: {
                  baz: 'qux',
                },
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'bar',
          params: {
            baz: 'qux',
          },
        });

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                format: null,
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldFormats.foo).to.be(undefined);

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldFormats.foo).to.be(undefined);
      });

      it('can set field "format" on an existing field', async () => {
        const title = `foo-${Date.now()}-${Math.random()}*`;
        const response1 = await supertest.post('/api/index_patterns/index_pattern').send({
          index_pattern: {
            title,
            fields: {
              foo: {
                name: 'foo',
                type: 'string',
                scripted: true,
                format: {
                  id: 'string',
                },
              },
            },
          },
        });

        expect(response1.status).to.be(200);
        expect(response1.body.index_pattern.fieldFormats.foo).to.be(undefined);
        expect(response1.body.index_pattern.fields.foo.format).to.eql({
          id: 'string',
        });

        const response2 = await supertest
          .post(`/api/index_patterns/index_pattern/${response1.body.index_pattern.id}/fields`)
          .send({
            fields: {
              foo: {
                format: { id: 'number' },
              },
            },
          });

        expect(response2.status).to.be(200);
        expect(response2.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'number',
        });
        expect(response2.body.index_pattern.fields.foo.format).to.eql({
          id: 'number',
        });

        const response3 = await supertest.get(
          `/api/index_patterns/index_pattern/${response1.body.index_pattern.id}`
        );

        expect(response3.status).to.be(200);
        expect(response3.body.index_pattern.fieldFormats.foo).to.eql({
          id: 'number',
        });
        expect(response3.body.index_pattern.fields.foo.format).to.eql({
          id: 'number',
        });
      });
    });
  });
}
